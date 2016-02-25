function loadFlattenedData() {

sections=[
 { id: "d2e21", num: "1", type: "section", marginalnote : "Rules of Court", text: ''},
 
  { id: "d2e29" , num: "1", type: "sub", text: "The Lieutenant Governor in Council may, by regulation, make rules that the " + 
          "Lieutenant Governor in Council considers necessary or advisable governing the conduct of " +
          "proceedings in the Court of Appeal, the Supreme Court and the Provincial Court."},
	 { id: "d2e38", num: "2", type: "sub", text: "Without limiting subsection (1), the rules may govern one or more of the " +
			  "following:"},
				  
		 { id: "d2e47", num: "a", type: "para", text:"practice and procedure in each of those courts;"},
		 { id: "d2e57", num: "b", type: "para", text:"the means by which particular facts may be proved and the mode by which evidence " +
					"may be given;", data: []},
		 { id: "d2e66", num: "b.1", type: "para", text:"appearances and applications by telephone or other means of telecommunication " +
					"before each of those courts;", data: []},
		 { id: "d2e75", num: "b.2", type: "para", text: "records in each of those courts, including the use of records in electronic or " +
					"any other format;", data: []},
		 { id: "d2e84", num: "c", type: "para", text: "costs and their review;", data:[]},
		 { id: "d2e93", num: "d", type: "para", text: "the establishment and collection of fees for services and duties provided by the " +
					"government or employees of the government or by other persons;", data: []},
		 { id: "d2e102", num: "e", type: "para", text:" the establishment and payment of fees and allowances payable to witnesses, " +
					"including witnesses for the Crown, jurors and other persons for services performed or " +
					"attendances made in any of the courts in British Columbia;", data:[]},
		 { id: "d2e112", num: "f", type: "para", text: "all matters arising under the Adult Guardianship Act", data:[]},
		 { id: "d2e140", num: "g", type: "para", text: "all matters arising under the Enforcement of candian Judgements and Decrees Act", data: []},
		 { id: "d2e152", num: "h", type: "para", text: "all matters arising under the Civil Forfeiture Act", data:[]},
		 
	 { id: "d2e164", num: "3", type: "sub", text: "In addition, the rules may make provision for the service of documents that start " +
			  "a proceeding, documents that add a new party to a proceeding and other documents out of " +
			  "British Columbia.", data: []},
	 { id: "d2e173", num: "4", type: "sub", text: "Rules under subsection (3) may be different for the service of " +
			  "documents that start a proceeding, documents that add a new party to a proceeding and " +
			  "other documents"},
			  
		{ id: "d2e182", num: "a", type: "para", text: "within Canada, or", data: []},
		{ id: "d2e192", num: "b", type: "para", text: "outside of Canada.", data: []},	  
			  
	 { id: "d2e201", num: "5", type: "sub", text:"In addition, in relation to the Court of Appeal, the rules may"},
	 
		{ id: "d2e210", num: "a", type: "para", text: "govern the introduction of evidence in the courst, and", data: []},
		{ id: "d2e219", num: "b", type: "para", text: "vary the applicatio of all or part of the Court of Appeal Act in respect of cross appeals.", data: []},
	 
	 { id: "d2e231", num: "6", type: "sub", text:"In addition, in relation to the Supreme Court, the rules may govern all matters " +
			  "governed by the Rules of Court as they stood on June 30, 2010.", data: []},
	 { id: "d2e240", num: "7", type: "sub", text: " In addition, in relation to the Provincial Court, the rules may make provision for " +
			  "the enforcement, by any means, of judgments given and summonses issued under the Small Claims act including rules"},
			  
		{id: "d2e253", num: "a", type: "para", text: "authorizing"},
		
			{ id: "d2e262", num: "i", type: "subpara", text: "the examination of a judgment debtor or a representative of the judgment " +
				  "debtor to determine the ability of the debtor to pay a judgment," },
			{ id: "d2e271", num: "ii", type: "subpara", text: "the court, after an examination referred to in subparagraph (i), to make " +
				  "orders permitting the judgment to be paid by installments or within a time specified " +
				  "by the court, and"},
			{ id: "d2e280", num: "iii", type: "subpara", text:"committal, for a maximum period that the rules may specify, for the failure of " +
				  "a judgment debtor to comply with an order referred to in subparagraph (ii),"},
		
		{id: "d2e289", num: "b", type: "para", text: "respecting seizure and sale of the judgment debtor's goods, and", data:[]},
		{id: "d2e298", num: "c", type: "para", text: "respecting garnishment before and after judgment.", data: []},
			 
	{ id: "d2e308", num: "8", type: "sub", text: "In addition, in relation to the Provincial Court and the Supreme Court, the rules " +
			  "may",},
		
		{ id:"d2e317", num: "a", type: "para", text: "permit or require, or provide to the court or to the parties to a proceeding the " +
            "ability to permit or require, mediation to be included as part of a proceeding, whether " +
            "or not the mediation is provided by or in the court, and" , data: []},
		{ id:"d2e326", num: "b", type: "para", text: "govern the conduct of, and all procedures relating to, the mediation.", data: []},

 { id: "d2e336", num: "2", type: "section", marginalnote: "Economical litigation", text: '', data : []},
	{id: "d2e344", num: "1", type: "sub", text: "The Lieutenant Governor in Council may make rules under section 1 (1), (2) and (5)" +
          " for the expeditious and efficient conduct of proceedings if the amount claimed is $100 000 " +
          "or less, exclusive of interest, or of interest under the Court Order Interest Act"},
	{id: "d2e356", num: "2", type: "sub", text: "Rules referred to in subsection (1) may provide for different practice and " +
          "procedure, and for different practice and procedure for different classes of proceedings, " +
          "with respect to"},
		  
		{id: "d2e365", num: "a", type: "para", text: "form and commencement of proceedings,"},
		{id: "d2e375", num: "b", type: "para", text: "interlocutory matters, and"},
		{id: "d2e384", num: "c", type: "para", text: "any other matter with respect to which rules may be made under section 1 (1), (2) or (6)."},
 
 { id: "d2e394", num: "3", type: "section", marginalnote: "Rules for money in court", text: ''},
 
	{ id: "d2e402", num : "1", type: "sub", text: "The Lieutenant Governor in Council may make rules for one or more of the " +
          "following:"},
		  
		{ id : "d2e411", num: "a", type: "para", text: "keeping of accounts for money in court, their form and the particulars to be " +
            "included in them;", data: []},
		{ id : "d2e420", num: "b", type: "para", text: "procedure and forms for payment into and out of court;", data:[]},
		{ id : "d2e430", num: "c", type: "para", text: "[Section repealed December 5, 2006]", data: []},
		{ id : "d2e439", num: "d", type: "para", text: "management, control and disposal of money in court and interest on " +
					"it;", data: []},
		{ id : "d2e448", num: "e", type: "para", text: "investment of money in court in investments permitted for a trust fund under " +
					"section 40 (4) of the Financial Administration Act and crediting of earnings form the investments to the money in court", data: []},
		{ id : "d1e451", num: "f", type: "para", text: "respecting the security to be provided by a personal representative, other than " +
					"a small estate declarant, for the administration of an estate.", data: []},
		  
	{ id: "d2e460", num : "2", type: "sub", text: "If there is a conflict between the Financial Administration Act or a directive made under that Act and a rule made under subsection (1), that Act of the directive prevails.", data: []},

 
 { id: "d2e473", num: "4", type: "section", marginalnote: "Rules for disclosure in family matters", text: "Without limiting section 1, the Lieutenant Governor in Council may make " +
        "rules for the disclosure of information in proceedings under the Family Law " +
        "Act, including rules requiring a corporation or partnership in which a " +
        "party to the proceeding has a legal or beneficial interest to disclose financial statements " +
        "or other information.", data: []},
 { id: "d2e488", num: "5", type: "section", marginalnote: "Regulations of official reporters", text: "After consultation with the Chief Justice of the Supreme Court, the Attorney General " +
        "may make regulations as follows", data: []},
 { id: "d2e538", num: "6", type: "section", marginalnote: "Consultation and recommendations", text: "The Lieutenant Governor in Council must not make a rule under sections 1 to 4 unless " +
        "the Lieutenant Governor in Council has received the recommendation of the Attorney General " +
        "after the Attorney General has consulted with the following:", data: []}
];

CourtRulesAct = { name : "Court Rules Act", chapter : "80", yearEnacted: "January 1, 1996", data: sections};

return CourtRulesAct;

}
/*
questions;
sections have marginal notes: does every object have to have same elements?
or just include subprargraphs when theyre there


unique nums:
 for subsections: should it be num = 1 or 1.1? 
 for paragraphs: a or 1.1.a?

an id that they are a paragraph/section/subsection so you know how to output them?

how do i deal with links?*/