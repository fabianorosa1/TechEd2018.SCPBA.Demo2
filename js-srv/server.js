/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0*/
/*eslint-env node, es6 */

"use strict";

const cds = require("@sap/cds");
const app = require("express")();
var xsenv = require("@sap/xsenv");

const port = process.env.PORT || 3000;
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
var options = {driver: "hana"};
Object.assign(options, hanaOptions.hana, {driver: options.driver});

cds.connect(options); 

// Simulate an ABAP ping endpoint
app.get("/sap/bc/ping", (req, res) => {
  res.send("Server reached.");
});

// healt endpoint
app.get("/health", (req, res) => {
  res.send("ok");
});

// Main app
//cds.serve('gen/csn.json') // TODO: use generated, which currently cannot compile to edm(x)
cds.serve("./my-service") // load from *.cds files
  .in(app)
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});