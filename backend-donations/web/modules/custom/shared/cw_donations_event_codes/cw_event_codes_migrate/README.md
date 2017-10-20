# Event Codes Migrate CSV

## How to use

### Prepare CVS file

1. In provided Excel file open event codes sheet and export as CSV.
Headers of the file should be:

  ```
  Source Code;Name;Type;Region;Campaign;Active;Should Appear in Online Dropdown?;Updated By;Updated Date;;
  ```

2. This module only uses columns 0 (code), 1 (label) and 6 (status). Make sure they exist and contain appropriate data.
3. Make sure line endings are `\n` or `r\n`.

### Upload CSV file into Drupal

1. Enable this module. It will enable all required dependencies.
2. Go to `admin/structure/event_code/settings/import-file-confg`.
3. Upload CSV file.  
   Note that file is saved as temporary and will be automatically removed in next few hours.

### Run import

1. SSH to backend-donations, go to `/web` folder and run:

  ```
  drush cr && drush migrate-import cw_event_codes_csv --update
  ```

  You should see "done with 'cw_event_codes_csv'" message from Migrate Tools.  
2. Go to `/admin/cw/event_code`. You should see imported event codes.


### Clean up

Uninstall this module:

```
drush pmu cw_event_codes_migrate -y
```
