var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");
var app = express();

app.listen(2005, function () {
    console.log("server started...");
})

app.use(express.static("public"));
app.use(fileuploader());

app.get("/profile", function (req, resp) {
    resp.contentType("text/html");
    resp.sendFile(process.cwd() + "/public/profile.html");
})


app.get("/admin", function (req, resp) {
    resp.contentType("text/html");
    resp.sendFile(process.cwd() + "/public/dash-admin.html");
})
// database connectivity========
var dbConfig = {
    host: "localhost",
    user: "root",
    password: "tanu1234$",
    database: "2023_jan",
    dateStrings: true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
    if (jasoos == null)
        console.log("connected succesfully..");
    else
        console.log(jasoos);
})

//submittion----------------------------

app.use(express.urlencoded(true));
app.post("/profile-db-signup", function (req, resp) {
    var fileName = "nopic.jpg";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }


    var temail = req.body.txtEmail;
    var tname = req.body.txtName;
    var tphone = req.body.txtPhone;
    var tadd = req.body.txtAdd;
    var tcity = req.body.txtCity;
    var tdob = req.body.txtdob;
    var tgen = req.body.txtGender;
    var tid = req.body.txtIDProof;
    var tpic = req.body.ppic;


    dbCon.query("insert into profile(emailid,name,contact,address,city,dob,gender,id,idpicname) values(?,?,?,?,?,?,?,?,?)", [temail, tname, tphone, tadd, tcity, tdob, tgen, tid, tpic], function (err) {
        if (err == null)
            resp.send("Record Saved Successfullllyyyyyyyyyyyyyyyyyy!!!!!!");
        else
            resp.send(err);
    })
})

//--------------------------------------------

app.post("/profile-db-update", function (req, resp) {
    var fileName = "nopic.jpg";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }



    var temail = req.body.txtEmail;
    var tname = req.body.txtName;
    var tphone = req.body.txtPhone;
    var tadd = req.body.txtAdd;
    var tcity = req.body.txtCity;
    var tdob = req.body.txtdob;
    var tgen = req.body.txtGender;
    var tid = req.body.txtIDProof;
    var tpic = req.body.ppic;

    dbCon.query("update profile set contact=? where emailid=?", [tphone, temail], function (err) {
        if (err == null)
            resp.send("updated successfully")
        else
            resp.send(err);
    })
})



app.use(express.urlencoded(true));
app.post("/profile-db-delete", function (req, resp) {
    var fileName = "nopic.jpg";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }

    var temail = req.body.txtEmail;
    var name = req.body.txtName;
    var phone = req.body.txtPhone;
    var add = req.body.txtAdd;
    var city = req.body.txtCity;
    var dob = req.body.txtdob;
    var gen = req.body.txtGender;
    var id = req.body.txtIDProof;
    var tpic = req.body.ppic;


    //fixed
    dbCon.query("delete from profile where email=?", [temail], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)

                resp.send("Account Removed Successfullyyyyyyyyyyyyyyyyyyy!!!!!!!!");
            else
                resp.send("Invalid Email id");

        }

    })
})

//azax-code-asynchronous javascript and XML
//====================================================================Index page==========
app.get("/", function (req, resp) {
    resp.contentType("text/html");
    resp.sendFile(Process.cwd() + "/public/index.html");
})
//====================================================================
app.get("/chk-email", function (req, resp) {
    //saving data in table
    //DB-signup wale m data m  use kiya hua name yha use krte h same hona chahiye

    //fixed
    dbCon.query("select* from uuser where email=?", [req.query.email], function (err, resultTable) { //agr memory m record h to resultant table m aa jayga
        if (err == null) {
            console.log(ji);
            if (resultTable.length == 1)     //ajax m hum affectedrows nhi length lenge

                resp.send("Already Taken!!!!");
            else
                resp.send("Available...!!!!");
        }
        else
            resp.send(err);

    })

})
app.get("/db-signup", function (req, resp) {
    console.log(req.query);
    dbCon.query("insert into uuser(email,pwd,type,dos,status) values(?,?,?,CURRENT_DATE(),1)", [req.query.email, req.query.pwd, req.query.type], function (err, resultTable) {
        // console.log("helo");
        if (err == null) {

            // console.log("tanu");
            resp.send("Signup Successful");
        }
        else
            resp.send(err);
    })
})




//=====================login============================================

app.get("/db-login", function (req, resp) {
    var data = [req.query.email, req.query.pwd];
    dbCon.query("select* from uuser where email=? and pwd=?", data, function (err, result) {
        if (err != null)
            resp.send(err.toString());

        else if (result.length == 1) {
            if (result[0].status == 1) {
                if (result[0].type == "Donor")
                    resp.send("Donor");
                else if (result[0].type = "Needy")
                    resp.send("Needy");
            }
            else if (result[0].status == 0) {
                resp.send("you  are blocked");
            }


        }
        else
            resp.send("invalid plz check email or password");
    });
});



//===============================profile-donar with bootstrap========================
app.get("/chk-email-donar", function (req, resp) {
    //saving data in table
    //DB-signup wale m data m  use kiya hua name yha use krte h same hona chahiye

    //fixed
    dbCon.query("select* from donar where email=?", [req.query.kuchEmail], function (err, resultTable) { //agr memory m record h to resultant table m aa jayga
        if (err == null) {
            console.log(resp);
            
            if (resultTable.length == 1) {
                resp.send("olddoner");
            }     //ajax m hum affectedrows nhi length lenge 
            else
                resp.send("newdoner");
        }
        else
            resp.send(err);

    })
})



app.get("")



app.use(express.urlencoded(true));
app.post("/profile-db-donar-save", function (req, resp) {
    var fileName = "nopic.jpg";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    var temail = req.body.txtEmail;
    var tname = req.body.txtName;
    var tphone = req.body.txtPhone;
    var tadd = req.body.txtAdd;
    var ttime = req.body.txtFrom;
    var t2time = req.body.txtTo;
    var tcity = req.body.txtCity;
    var tid = req.body.txtIDProof;

  
    dbCon.query("insert into donar(email,name,mobile,address,hours,city,id,idpicname,t2time) values(?,?,?,?,?,?,?,?,?)", [temail, tname, tphone, tadd, ttime, tcity, tid, fileName, t2time], function ( err) {
        if (err == null)
            resp.send("Record Saved Successfullllyyyyyyyyyyyyyyyyyy!!!!!!");
        else
            resp.send(err);
    })
})

app.get("/get-json-record", function(req,resp){
   
    dbCon.query("select * from donar where email=?", [req.query.kuchEmail],function(err,resultTableJSON){
        if(err==null){
            if(resultTableJSON.length==1){
                console.log(resultTableJSON);
                resp.json(resultTableJSON);
            }
            else
            resp.json("new user");
        }else{
            resp.send(err);
        }
    });
});
  



 





app.post("/profile-db-donar-update", (req, res) => {
    // Get the form data from the request body
    const {
      txtEmail,
      txtName,
      txtPhone,
      txtAdd,
      txtFrom,
      txtTo,
      txtCity,
      txtIDProof
    } = req.body;
  
    // Handle the file upload if a new image is provided
    let fileName = "nopic.jpg";
    if (req.files && req.files.ppic) {
      fileName = req.files.ppic.name;
      const path = __dirname + "/public/uploads/" + fileName;
      req.files.ppic.mv(path);
    }
  
    // Update the donor information in the database
    const sql = "UPDATE donar SET name=?, mobile=?, address=?, hours=?, t2time=?, city=?, id=? WHERE email=?";
    const values = [txtName, txtPhone, txtAdd, txtFrom, txtTo, txtCity, txtIDProof, txtEmail];
  
    dbCon.query(sql, values, (err, result) => {
      if (err) {
        res.send("Error updating donor information.");
      } else {
        res.send("Donor information updated successfully.");
      }
    });
  });
    



 

  

//==============================avail-medicine================================================


app.post("/avail-med", function (req, resp) {

    console.log(req.body);
    var temail = req.body.txtEmail;
    var tname = req.body.txtName;
    var tdat = req.body.txtdat;
    var tpack = req.body.txtpacking;
    var tqty = req.body.txtqty;


    dbCon.query("insert into availmed(email,med,expdate,packing,qty) values(?,?,?,?,?)", [temail, tname, tdat, tpack, tqty], function (err, resultTable) {
        if (err == null)
            resp.send("Record Saved Successfullllyyyyyyyyyyyyyyyyyy!!!!!!");
        else
            resp.send(err);
    })
})






//===================settings donar-dash html========================================



app.get("/db-update", function (req, resp) {
   
   var data=[req.query.newpwd, req.query.email,req.query.oldpwd];
    dbCon.query("update uuser set pwd=? where email=? and pwd=?", data, function (err, resultTable) {
        if (err == null) {
            console.log(".......");
            resp.send("password updated");
        }
        else {
            resp.send(err);
        }
    });

});









//=======Needy-profile=====================================================================





app.get("/chk-email-needy", function (req, resp) {
    //saving data in table
    //DB-signup wale m data m  use kiya hua name yha use krte h same hona chahiye

    //fixed
    dbCon.query("select* from needy where email=?", [req.query.kuchEmail], function (err, resultTable) { //agr memory m record h to resultant table m aa jayga
        if (err == null) {
           console.log(resultTable.length);
            
            if (resultTable.length == 1) {
                resp.send(resultTable);
            }    
            else
                resp.send("newuser");
        }
        else
            resp.send(err);

    })
})
//========================================================needy db profile save======================


app.use(express.urlencoded(true));
app.post("/profile-db-needy-save", function (req, resp) {
    var fileName = "nopic.jpg";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }


    var temail = req.body.txtEmail;
    var tname = req.body.txtName;
    var tphone = req.body.txtPhone;

    var tcity = req.body.txtAdd;
    var tgender = req.body.txtGender;

    var tdob = req.body.txtdob;

    dbCon.query("insert into needy(email,name,mobile,city,gender,dob,picpath) values(?,?,?,?,?,?,?)", [temail, tname, tphone, tcity, tgender, tdob, fileName], function (err, resultTable) {
        if (err == null)
            resp.send("Record Saved Successfullllyyyyyyyyyyyyyyyyyy!!!!!!");
        else
            resp.send(err);
    })
})



//===========================================needy update in profile=====================
app.post("/profile-db-needy-update", function (req, resp) {
    var fileName = "nopic.jpg";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        var path = process.cwd() + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }



    var temail = req.body.txtEmail;
    var tname = req.body.txtName;
    var tphone = req.body.txtPhone;

    var tcity = req.body.txtAdd;
    var tgender = req.body.txtGender;

    var tdob = req.body.txtdob;

    dbCon.query("update needy set mobile=?, name=?, dob=?,gender=?,city=?,picpath=? where email=?", [tphone, tname, tdob, tgender, tcity, fileName, temail], function (err, resultTable) {
        if (err == null)
            resp.send("updated successfully")
        else
            resp.send(err);
    })
})



//===================panel-user.html=================
app.get("/get-angular-all-records", function (req, resp) {
    dbCon.query("select * from uuser", function (err, resultTable) {

        if (err == null) {
           
            resp.send(resultTable);
        }

        else
            resp.send(err);
    })
})

app.get("/do-angular-delete", function (req, resp) {
    var email = req.query.email;
  
    dbCon.query("delete from uuser where email=?", [email], function (err, resultTable) {
        if (err == null) {
            if (resultTable.affectedRows == 1)
                resp.send("Account Removed Successfully");
            else
                resp.send("Invalid Email id");
        }
       
    })
})

//=================================================================
app.get("/do-angular-block", function (req, resp) {
    var email = req.query.email;
  
    dbCon.query("update uuser set status=0 where email=?", [email], function (err, resultTable) {
        if (err == null) {

            resp.send("user has been blocked successfully");
        }
        else {
            resp.send(err); 
        }
    })
})

//========================================================================
app.get("/do-angular-resume", function (req, resp) {
    var email = req.query.email;
   
    dbCon.query("update uuser set status=1 where email=?", [email], function (err, resultTable) {
        if (err == null) {
            resp.send("user has been resumed  successfully");
        }
        else {
            resp.send(err);
        }
    })
})
//====================================================needy records from panel-needy.html=======
app.get("/get-angular-all-needy-records", function (req, resp) {
    dbCon.query("select* from needy ", function (err, resultTable) {
        if (err == null)
            resp.send(resultTable);
        else
            resp.send(err);
    })
})

//=================================donars record panel-donar.html==============================
app.get("/get-angular-all-donar-records", function (req, resp) {
    dbCon.query("select* from donar ", function (err, resultTable) {
        if (err == null)
            resp.send(resultTable);
        else
            resp.send(err);
    })
})


//============================avil medicine record from med-manager.html
// Server-side code

app.get("/get-angular-all-availmedicine-records", function (req, resp) {
    var email = req.query.email;
    dbCon.query("SELECT * FROM availmed WHERE email=?", [email], function (err, resultTable) {
        if (err == null)
            resp.send(resultTable);
        else
            resp.send(err);
    });
});

app.get("/do-angular-delete-availmedicine", function (req, resp) {
    var sno = req.query.sno;
    dbCon.query("DELETE FROM availmed WHERE sno=?", [sno], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Record deleted successfully");
            else
                resp.send("Invalid sno");
        } else {
            resp.send(err);
        }
    });
});





//===================================finder-med.html for selection of distinct cities==================

//=========MEDICINE-FINDER===========
app.get("/get-angular-find-medDonors-city", function(req, resp) {
    console.log("hit json");
    dbCon.query("SELECT distinct city FROM donar ",function(err, resultTableJSON) {
      if (err == null) {
      
          console.log(resultTableJSON.length);
          resp.json(resultTableJSON); // Send the JSON object as the response
     
      } else {
        resp.send(err);
      }
    });
  });
 
  //-------------------------------
  app.get("/get-angular-find-medAvail-med", function(req, resp) {
    console.log("hit json");
    dbCon.query("SELECT distinct med FROM availmed ",function(err, resultTableJSON) {
      if (err == null) {
      
          console.log(resultTableJSON.length);
          resp.json(resultTableJSON); // Send the JSON object as the response
     
      } else {
        resp.send(err);
      }
    });
  });
  //--------------------------------
 
  app.get("/fetch-donors",function(req,resp)
 {
   console.log(req.query);
   var med=req.query.medKuch;
   var city=req.query.cityKuch;
 
   var query="select donar.email, donar.name, donar.mobile, donar.address, donar.id, donar.idpicname, donar.hours, donar.t2time , availmed.med, availmed.expdate, availmed.qty, availmed.packing from DONAR inner join AVAILMED on donar.email= availmed.email where availmed.med=? and donar.city=?";
   
 
   dbCon.query(query,[med,city],function(err,resultTable)
   {
     console.log(resultTable+"      "+err);
   if(err==null)
     resp.send(resultTable);
   else
     resp.send(err);
   })
 })