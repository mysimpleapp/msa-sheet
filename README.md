# msa-sheet
MySimpleApp genereic component to create html content in a WYSIWYG way.

## SERVER API

The following code is available by importing the corresponding node module:
```javascript
// Example
var msaSheet = Msa.require("msa-sheet")
```

### Function: msaSheet.registerType
From `index.js`

Register a new sheet type.

Each sheet type has its own configuration (default permissions, default content), its own database collection.

```javascript
// Simple example
msaSheet.registerType("my_sheet_type")

// Complete example
msaSheet.registerType("my_sheet_type", {
  // default content
  content: "<div>Hello</div>",
  // default permissions
  perms: {
    create: { group:"admin"}
  },
  // DB collection
  dbCollection: "my_sheet_types"
})
```

* __msaSheet.registerType__: `Function(type[, args])`
  * __*type__: `String`, new sheet type to create and register.
  * __args__: `Object`, possible properties are:
    * __content__: `HTML Expr`, default sheet content.
    * __perms__: `Object`, default user permissions. The possible properties are:
      * __create__: `User Expr`, users hqving permission to create sheets of this type.
    * __dbCollection__: `String` or `Collection`, DB collection where sheets of this tpe will be stored.

### Function: msaSheet.registerTemplate
From `index.js`

Register a piece of html to be insertable in a sheet by the user.

```javascript
// Simple example
var welUrl = Msa.compsUrl+"/my-custom-element/my-custom-element.html"
msaSheet.registerTemplate("My super element", { wel:welUrl })

// Complex example
msaSheet.registerTemplate("My super element", { wel:welUrl },
  {
    img:"<img src='/url/of/img.jpg'></img>"
  })
```

* __msaSheet.registerTemplate__: `Function(name, html [, args])`
  * __*name__: `String`, name of the template.
  * __*html__: `HTML Expr`, content of the template.
  * __args__: `Object`, possible properties are:
    * __img__: `HTML Expr`, image used in the template selection menu.
    * __head__: `HTML Expr`, associated HEAD dependencies on template (if the template is a web element, this field is automatically filled).

### Function: msaSheet.registerHead
From `index.js`

If a HTML element can be inserted in a sheet (with a template for example), and this element needs to import some external content (such as a web component), then this external content needs to be registered with this function.

```javascript
// Example
var welUrl = Msa.compsUrl+"/my-custom-element/my-custom-element.html"
msaSheet.registerHead("my-custom-element", { html:welUrl })
```

* __msaSheet.registerHead__: `Function(tag, head)`
  * __*tag__: `String`, tag of the element to register.
  * __*head__: `HTML Expr`, HEAD dependencies associated to element.

### Function: msaSheet.getSheet
From `index.js`

Get a formatted sheet from database.

```javascript
// Simple example
msaSheet.getSheet("page", "home", function(err, sheet){
	if(err) console.error(err)
	else if(sheet===null) console.log("The requested sheet does not exist")
	else console.log("The requested sheet:", sheet)
})

// Complex example
msaSheet.getSheet("page", "home",
  {
		user: req.session.user
		ifNotExist": "create"
	},
	function(err, sheet){
		if(err===401) console.error("User is not authorized to view this sheet")
		else if(err) console.error(err)
		else console.log("The requested sheet:", sheet)
	}
)
```

* __msaSheet.getSheet__: `Function(type, name [, args], next)`
  * __*type__: `String`, sheet type.
  * __*name__: `String`, sheet name.
  * __args__: `Object`, possible properties are:
    * __user__: `User Object`.
    * __checkUserPerms__: `Boolean`, check if user is authorized to view the sheet (default: true if user is provided, false otherwise).
    * __ifNotExist__: `String` or `Function()`, behaviour when requested sheet does not exist.
      * if __"null"__: returned sheet is null (default value).
      * if __"error"__: trigger an error.
      * if __"create"__: create the sheet (see __msaSheet.createSheet__ for more details).
      * if `Function()`, call this function.
  * __next__: `Function(err, sheet)`
    * __err__: returned error (if any).
    * __sheet__: returned sheet.

### Function: msaSheet.createSheet
From `index.js`

Create a sheet in database.

```javascript
// Simple example
msaSheet.createSheet("page", "home", function(err, sheet){
  if(err) console.error(err)
  else console.log("The created sheet:", sheet)
})

// Complex example
msaSheet.createSheet("page", "home",
  {
    user: req.session.user
    ifExist: "error",
    insertInDb: false
  },
  function(err, sheet){
    if(err===401) console.error("User is not authorized to create this sheet")
    else if(err) console.error(err)
    else console.log("The created sheet:", sheet)
  }
)
```

* __msaSheet.createSheet__: `Function(type, name [, args], next)`
  * __*type__: `String`, sheet type.
  * __*name__: `String`, sheet name.
  * __args__: `Object`, possible properties are:
    * __user__: `User Object`.
    * __checkUserPerms__: `Boolean`, check if user is authorized to create the sheet (default: true if user is provided, false otherwise).
    * __ifExist__: `String` or `Function()`, behaviour when sheet already exists in database.
      * if __"get"__: default value, return the sheet that already exists (see __msaSheet.getSheet__ for more details).
      * if __"null"__: returned sheet is null.
      * if __"error"__: trigger an error.
      * if `Function(sheet)`, call this function.
        *__sheet__: the sheet that already exists.
    * __insertInDb__: Do insert the created sheet in database (default: true)
  * __next__: `Function(err, sheet)`
    * __err__: returned error (if any).
    * __sheet__: returned created sheet.

### Function: msaSheet.updateSheet
From `index.js`

Update a sheet in database.

```javascript
// Simple example
msaSheet.updateSheet("page", "home",
  { content:"<div>Coucou</div>" },
  function(err, sheet){
    if(err) console.error(err)
    else console.log("The updated sheet:", sheet)
  }
)

// Complex example
msaSheet.updateSheet("page", "home",
  { content:"<div>Coucou</div>" },
  {
    user: req.session.user
    ifNotExist: "error",
    insertInDb: false
  },
  function(err, sheet){
    if(err===401) console.error("User is not authorized to update this sheet")
    else if(err) console.error(err)
    else console.log("The updated sheet:", sheet)
  }
)
```

* __msaSheet.updateSheet__: `Function(type, name, updates [, args], next)`
  * __*type__: `String`, sheet type.
  * __*name__: `String`, sheet name.
  * __*updates__: `Object`, sheet updates. The possible properties are:
    * __content__: `HTML Expr`, the new content of the sheet.
  * __args__: `Object`, possible properties are:
    * __user__: `User Object`.
    * __checkUserPerms__: `Boolean`, check if user is authorized to create the sheet (default: true if user is provided, false otherwise).
    * __ifNotExist__: `String` or `Function()`, behaviour when sheet does not exist in database.
      * if __"create"__: default value, create a new sheet and update it (see __msaSheet.createSheet__ for more details).
      * if __"null"__: returned sheet is null.
      * if __"error"__: trigger an error.
      * if `Function()`, call this function.
    * __insertInDb__: Do update the created sheet in database (default: true)
  * __next__: `Function(err, sheet)`
    * __err__: returned error (if any).
    * __sheet__: returned updated sheet.

## LICENSE
MIT
