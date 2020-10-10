

import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";
//require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);

import {DomHelper} from "./components/helpers/DomHelper";
import {Request} from "./components/fetch/Request";
import {AdminInitPanel} from "./components/admin/AdminInitPanel";


new AdminInitPanel({
    shomListOfTablesBtn: ".show-tables",
    listOfTablesWrapper: ".admin__list-of-sections",
    listOfRecordsWrapper: ".admin__records-wrapper"
});







