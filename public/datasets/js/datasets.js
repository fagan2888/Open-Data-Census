 $(document).ready(function() {
     Tabletop.init({
         key: "1OhVbryeHBsPjJ3TjjVFlfM552pDKRjiUpTAXQJe9miA",
         callback: showInfo,
         parseNumbers: true
     });
 });



 var allRows = [];

 function showInfo(data, tabletop) {
     allRows = _.sortBy(tabletop.sheets("Census Data").all(), "State");

     var uri = new URI();
     var params = uri.search(true);

     if (params) {
         var filters = [];
         filters.push(buildStateFilter(params["state"]));
         filters.push(buildDatatypeFilter(params["datatype"]));
         updateCards(allRows, _.compact(filters));
     } else {
         updateCards(allRows);
     }
 }

 function updateCards(rows, filters) {
     var filters = filters || [];
     var source = $("#card-template").html();
     var template = Handlebars.compile(source);

     _.chain(rows)
         .filter(function(row) {
                 return _.all(filters, function(filter) {
                     return filter(row);
                 });
        })
         .map(function(row) {
          
           row.exists = row["Exists"];
           row.online = row["Digitized"];
           row.online = row["Online"];
           row.machine = row["Machine readable"];
           row.bulk = row["Available in bulk"];
           row.openLicense = row["Open license"];
           row.fresh = row["Up-to-date"];
           row.inRepo = row["In the state repository"];
           row.verifiable = row["Verifiable"];
           row.complete = row["Complete"];

           row.existsCaption = captions.exists[row.exists];
           row.onlineCaption = captions.online[row.online];
           row.machineCaption = captions.machine[row.machine];
           row.bulkCaption = captions.bulk[row.bulk];
           row.openLicenseCaption = captions.openLicense[row.openLicense];
           row.freshCaption = captions.fresh[row.fresh];
           row.inRepoCaption = captions.inRepo[row.inRepo];
           row.verifiableCaption = captions.verifiable[row.verifiable];
           row.completeCaption = captions.complete[row.complete];

             var html = template(row);
            $("#cards").append(html);
            $('[data-toggle="tooltip"]').tooltip();  
        });
 }




 function buildStateFilter(state) {
     if (!state) {
         return false;
     }
     return function(row) {
         return row["State"] === state;
     }
 }

 function buildDatatypeFilter(datatype) {
     if (!datatype) {
         return false;
     }
     return function(row) {
         return row["Type of Data"] === datatype;
     }
 }

 function clearCards() {
     $("#cards").empty();
 }

 function filterByState(state) {
     clearCards();
     updateCards(allRows, [buildStateFilter(state)]);
 }

 function resetSearch() {
     clearCards();
     updateCards(allRows);
 }

 function filterByDatatype(datatype) {
     clearCards();
     updateCards(allRows, [buildDatatypeFilter(datatype)]);
 }

 function filterByMachineReadable(machineReadable) {
     clearCards();
     updateCards(_.filter(allRows, function(row) {
         return machineReadable ? row["Machine readable"] === "Yes" : row["Machine readable"] === "No";
     }))
 }