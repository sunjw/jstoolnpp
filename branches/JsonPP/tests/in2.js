[{
		"glossary" : {
			"title" : "example glossary",
			"GlossDiv" : {
				"title" : "S",
				"GlossList" : {
					"GlossEntry" : {
						"ID" : "SGML",
						"SortAs" : "SGML",
						"GlossTerm" : "Standard Generalized Markup Language",
						"Acronym" : "SGML",
						"Abbrev" : "ISO 8879:1986",
						"GlossDef" : {
							"para" : "A meta-markup language, used to create markup languages such as DocBook.",
							"GlossSeeAlso" : ["GML", "XML"]
						},
						"GlossSee" : "markup"
					}
				}
			}
		}
	}, {
		"menu" : {
			"id" : "file",
			"value" : "File",
			"popup" : {
				"menuitem" : [{
						"value" : "New",
						"onclick" : "CreateNewDoc()"
					}, {
						"value" : "Open",
						"onclick" : "OpenDoc()"
					}, {
						"value" : "Close",
						"onclick" : "CloseDoc()"
					}
				]
			}
		}
	}
]
