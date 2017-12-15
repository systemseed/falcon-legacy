/* eslint-disable */
gemini.suite('frontpage', (suite) => {
  suite
    .setUrl('/')
    .setCaptureElements('body')
    .capture('plain', (actions) => {
      // Wait for data from backend.
      actions
        .waitForElementToShow('.navbar', 4000)
        .executeJS(function (window) {
          var el = window.document.getElementsByClassName('navbar')[0];
          el.remove();
        })
        .waitForElementToShow('.filters-bar', 4000);
    });
});
