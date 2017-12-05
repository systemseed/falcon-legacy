We import/export dummy content with Default content module, 
see more information: http://cgit.drupalcode.org/default_content/tree/README.md

## Export
Update content on the site and run by drush:
`drush --user=1 dcer ENTITY_TYPE ENTITY_ID --folder=modules/custom/shared/falcon_demo_content/content`

Examples:
`drush --user=1 dcer node 3 --folder=modules/custom/shared/falcon_demo_content/content`

`drush --user=1 dcer commerce_product 17 --folder=modules/custom/shared/falcon_demo_content/content`

`drush --user=1 dcer taxonomy_term 1 --folder=modules/custom/shared/falcon_demo_content/content`

`drush --user=1 dcer event_code 6 --folder=modules/custom/shared/falcon_demo_content/content`

`drush --user=1 dcer featured_image 1 --folder=modules/custom/shared/falcon_demo_content/content`

## Import
Enable `falcon_demo_content` module, it will import content from `./falcon_demo_content/content` folder automatically.

## Notes
We use `better_normalizers` module to keep exported files in base64 format.