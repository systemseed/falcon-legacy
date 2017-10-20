<?php

use Codeception\Event\PrintResultEvent;
use Codeception\Events;
use Codeception\Extension;
use Codeception\Test\Descriptor;

/**
 * Class RunFailed
 *
 * Clone of \Codeception\Extension\RunFailed with support of dependant tests.
 *
 */
class RunFailed extends \Codeception\Extension\RunFailed {
  public function saveFailed(PrintResultEvent $e)
  {
    $file = $this->getLogDir() . $this->config['file'];
    $result = $e->getResult();
    if ($result->wasSuccessful()) {
      if (is_file($file)) {
        unlink($file);
      }
      return;
    }
    $output = [];
    foreach ($result->failures() as $fail) {
      $test_path = $this->localizePath(Descriptor::getTestFullName($fail->failedTest()));
      $test_file = substr($test_path, 0, strpos($test_path, ':'));
      // Add dependencies before the test itself.
      foreach ($fail->failedTest()->getMetadata()->getDependencies() as $dependency) {
        $output[] = "$test_file:$dependency";
      }
      $output[] = $test_path;
    }
    foreach ($result->errors() as $fail) {
      $test_path = $this->localizePath(Descriptor::getTestFullName($fail->failedTest()));
      $test_file = substr($test_path, 0, strpos($test_path, ':'));
      // Add dependencies before the test itself.
      foreach ($fail->failedTest()->getMetadata()->getDependencies() as $dependency) {
        $output[] = "$test_file:$dependency";
      }
      $output[] = $test_path;
    }

    // Add skipped tests into failed group so they will have a chance to rerun
    // if they were skipped due to failed dependency.
    foreach ($result->skipped() as $fail) {
      $test_path = $this->localizePath(Descriptor::getTestFullName($fail->failedTest()));
      $test_file = substr($test_path, 0, strpos($test_path, ':'));
      // Add dependencies before the test itself.
      foreach ($fail->failedTest()->getMetadata()->getDependencies() as $dependency) {
        $output[] = "$test_file:$dependency";
      }
      $output[] = $test_path;
    }

    $output = array_unique($output);

    file_put_contents($file, implode("\n", $output));
  }
}
