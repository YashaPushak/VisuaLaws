function loadChanges()
{


changesApril03 =[
{ id :"d2e308", section: "1", num: "8", type: "sub", change: 1, text: "[Section added April 28, 2003]"},
{ id :"d2e317", section: "1", num: "a", type: "para", change: 1, text: "[Section added April 28, 2003]"},
{ id :"d2e326", section: "1", num: "b", type: "para", change: 1, text: "[Section added April 28, 2003]"},
];

changesMarch05 = [
{id: "d2e344", num: "1", type: "sub", change: 0, text: "The Lieutenant Governor in Council may make rules under section 1 (1), (2) and (5) for the expeditious and efficient conduct of proceedings if the amount claimed is $20 000 or less, exclusive of interest, or of interest under the Court Order Interest Act."},
{id: "d2e356", num: "2", type: "sub", change: 0, text: "Rules referred to in subsection (1) may provide for different practice and procedure with respect to"},
];

changesApril06 = [
{ id :"d2e152" , section: "1", type: "para", num: "h", change: 1, text: "[Section added April 20, 2006]"}
];

changesMay06 = [
{ id: "d2e140", section: "1", type: "para", num: "g", change: 0, text: "not in force"}
];

changesDec06 = [
{ id :"d2e448", section: "3", type: "para", num: "e", change: 0, text: "investment of money in court in investments permitted for a trust fund under section 36 (2) of the Financial Administration " + 
          "Act and crediting of earnings from the investments to the money in court."},
{ id : "d2e430", change: -1, num: "c", type: "para", text: "facilitating the court business and practice for the custody, care and disposal " +
            "of money in court or belonging to suitors;"},
];

changesJuly10 = [
{ id :"d2e164", section:"1", type: "sub", num: "3", change: 0, text: "In addition, the rules may make provision for the service of originating process and other documents out of British " +
        "Columbia."},
 { id : "d2e173", section: "1", type: "sub", num: "4", change: 0, text:"Rules under subsection (3) may be different for the service of originating process and other documents"},
 { id : "d2e231", section: "1", type: "sub", num: "6", change: 0, text: "In addition, in relation to the Supreme Court, the rules may govern all matters currently governed by the Rules of Court as they stand on " +
        "June 29, 1990."}
];

changesSept11 = [
 { id : "d2e112", section: "1", change: 0, type: "para", num: "f", text: "all matters arising under the Adult Guardianship Act, the Infants Act, Part 1, the Land Title Inquiry Act, the Patients Property Act and the Wills Variation Act"}
];

changesMarch13 = [
{ id: "d2e473", num: "4", type: "section", change:0, marginalnote: "Rules for disclosure in family matters", text: "Without limiting section 1, the Lieutenant Governor in Council may make rules for the disclosure of information in proceedings under the Family Relations Act, including rules requiring a corporation or partnership in which a party to the proceeding has a legal or beneficial interest to disclose financial statements or other information.", data: []},
 
];

changesMar14 = [
 { id :"d2e112", section: "1", type: "para", num: "f", change: 0, text: "all matters arising under the Adult Guardianship Act, Part 1 of the Infants Act, the Land Title Inquiry Act, the Patients Property Act, Parts 2 and 3 of the Power of Attorney Act, and the Wills Variation Act"},
 { id :"d1e451", section: "3", type: "para", num: "f", change: 1, text: "[Section was added March 31, 2014]"}
];

data =[
 {date: new Date("April 28, 2003"), data: changesApril03},
 {date: new Date("March 30, 2005"), data: changesMarch05},
 {date: new Date("April 20, 2006"), data: changesApril06},
 {date: new Date("May 4, 2006"), data: changesMay06},
 {date: new Date("December 4, 2006"), data: changesDec06},
 {date: new Date("July 1, 2010"), data: changesJuly10},
 {date: new Date("September 1, 2011"), data: changesSept11},
 {date: new Date("March 18, 2013"), data: changesMarch13},
 {date: new Date("March 31, 2014"), data: changesMar14}
 
];

return data;

}

/*
added 1
repealed -1
amended 0

multiple sections changed
supplements changed but don't show up in original document*/