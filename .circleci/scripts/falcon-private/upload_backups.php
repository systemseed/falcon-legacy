<?php

/***
 * This job uploads backups from /home/circleci/backups/ folder to AWS S3.
 * Adapted from an example by https://bitbucket.org/snippets/kaypro4/gnB4E.
 *
 * Usually it's triggered by Circle CI automatically.
 * To trigger manually (for debugging) run the following command:
 * php .circleci/scripts/falcon-private/upload_backups.php
 */

require 'vendor/autoload.php';

use Aws\S3\S3Client;

// Get Amazon settings from the environment variables.
$aws_region = getenv('AWS_BACKUP_BUCKET_REGION') ? getenv('AWS_BACKUP_BUCKET_REGION') : 'eu-west-1';
$aws_bucket = getenv('AWS_BACKUP_BUCKET');
$aws_access_key_id = getenv('AWS_BACKUP_ACCESS_KEY_ID');
$aws_secret_access_key = getenv('AWS_BACKUP_SECRET_ACCESS_KEY');

// Root folder in S3 for this project backups.
$destination_backups_dir = getenv('CIRCLE_PROJECT_REPONAME');
// Folder to backup.
$source_backups_dir = getenv('HOME') . '/backups';

// Skip script execution if any of AWS variables are empty.
if (empty($aws_bucket) || empty($aws_region) || empty($aws_access_key_id) || empty($aws_secret_access_key)) {
  echo "ERROR: some AWS variables are empty. Make sure AWS settings are added as Circle variables.\n";
  exit(1);
}

echo "== UPLOADING OF BACKUPS STARTED " . date('d.m.Y H:i:s') . " ==\n\n";

// Initialize Amazon S3 connection.
$s3 = new S3Client([
  'version' => 'latest',
  'region' => $aws_region,
  'credentials' => [
    'key' => $aws_access_key_id,
    'secret' => $aws_secret_access_key,
  ]
]);

foreach (glob("$source_backups_dir/*/*.gz") as $filename) {
  // Path to file on Amazon S3.
  $aws_file_key = str_replace($source_backups_dir, $destination_backups_dir, $filename);

  try {
    if ($s3->doesObjectExist($aws_bucket, $aws_file_key)) {
      echo "ERROR: file $aws_file_key already exists in S3. Skipping.\n";
      continue;
    }

    $aws_tags = 'type=daily';
    // If it's first day of month then mark this backup as monthly in S3.
    // It allows to apply different lifecycle rules to different types of backups.
    if (date('j') == '1' && date('G') < 10) {
      $aws_tags = 'type=monthly';
    }

    // Push database backup to Amazon server.
    $result = $s3->putObject([
      'Bucket' => $aws_bucket,
      'Key' => $aws_file_key,
      'SourceFile' => $filename,
      'ServerSideEncryption' => 'AES256',
      'Tagging' => $aws_tags,
    ]);

    if ($result && $result['ObjectURL']) {
      echo "Success: " . $result['ObjectURL'] . "\n";
    }
    else {
      echo "ERROR: " . $filename . "\n";
    }

  }
  catch (Aws\S3\Exception\S3Exception $e) {
    echo "ERROR: " . $filename . "\n";
    echo $e->getMessage() . "\n";
  }
}

echo "== UPLOADING OF BACKUPS FINISHED " . date('d.m.Y H:i:s') . " ==\n\n";
