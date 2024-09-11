var roleacess = [
  {
    role: "Admin",
    routes: [
      {
        layout: "indexlayout",
      },
      {
        layout: "accesslayout",
      },
      {
        layout: "admin_userlayout",
      },
      {
        layout: "careerlayout",
      },
      {
        layout: "strands_typelayout",
      },
      {
        layout: "videocliplayout",
      },
      {
        layout: "job_requirementslayout",
      },
      {
        layout: "skills_requirementslayout",
      },
      {
        layout: "assessmentslayout",
      },
      {
        layout: "personality_typelayout",
      },
      // {
      //   layout: "scholarshiplayout",
      // },
      // {
      //   layout: "approvedapplicationlayout",
      // },
      // {
      //   layout: "master_gradeslayout",
      // },
    ],
  },
  {
    role: "Super Admin",
    routes: [
      {
        layout: "sp_admin_indexlayout",
      },
      {
        layout: "sp_admin_schoollayout",
      },
      // {
      //   layout: "assessmentslayout",
      // },
      // {
      //   layout: "careerlayout",
      // },
      // {
      //   layout: "strands_typelayout",
      // },
      // {
      //   layout: "videocliplayout",
      // },
      // {
      //   layout: "job_requirementslayout",
      // },
      // {
      //   layout: "skills_requirementslayout",
      // },
      // {
      //   layout: "calendarlayout",
      // },
      // {
      //   layout: "questionslayout",
      // },
      // {
      //   layout: "scholarshiplayout",
      // },
      // {
      //   layout: "approvedapplicationlayout",
      // },
      // {
      //   layout: "master_gradeslayout",
      // },
    ],
  },
  // {
  //   role: "STUDENT",
  //   routes: [
  //     {
  //       layout: "studentindexlayout",
  //     },
  //     {
  //       layout: "studentprofilelayout",
  //     },
  //     {
  //       layout: "finishapplicationlayout",
  //     },
  //     {
  //       layout: "testpermitlayout",
  //     },
  //   ],
  // },
];


exports.Validator = function (req, res, layout) {
  // console.log(layout);

  let ismatch = false;
  let counter = 0;
  // //console.log(roleacess.length)
  if (req.session.accesstype == "Admin" && layout == "indexlayout") {
    console.log("hit");
    return res.render(`${layout}`, {
      image: req.session.image,
      studentid: req.session.studentid,
      fullname: req.session.fullname,
      accesstype: req.session.accesstype,
      status: req.session.status,
    });
  } else {
    roleacess.forEach((key, item) => {
      counter += 1;
      var routes = key.routes;

      routes.forEach((value, index) => {
        // console.log(`${key.role} - ${value.layout}`);

        if (key.role == req.session.accesstype && value.layout == layout) {
          console.log("Role: ", req.session.accesstype, "Layout: ", layout);
          ismatch = true;

          return res.render(`${layout}`, {
            image: req.session.image,
            studentid: req.session.studentid,
            fullname: req.session.fullname,
            accesstype: req.session.accesstype,
            status: req.session.status,
          });
        }
      });

      if (counter == roleacess.length) {
        if (!ismatch) {
          res.redirect("/login");
        }
      }
    });
  }
};


exports.SuperAdminValidator = function (req, res, layout) {
  let ismatch = false;
  let counter = 0;

  roleacess.forEach((key, item) => {
    counter += 1;
    var routes = key.routes;

    routes.forEach((value, index) => {
      // Check if the layout matches
      if (value.layout == layout) {
        console.log("Layout: ", layout);
        ismatch = true;

        return res.render(`${layout}`, {
          image: req.session.image,
          userid: req.session.userid,
          fullname: req.session.fullname,
          status: req.session.status,
        });
      }
    });

    if (counter == roleacess.length) {
      if (!ismatch) {
        res.redirect("/sp_admin_login");
      }
    }
  });
};




// exports.UserValidator = function (req, res, layout) {
//   // console.log(layout);

//   let ismatch = false;
//   let counter = 0;
//   // //console.log(roleacess.length)
//   if (req.session.accesstype == "STUDENT" && layout == "studentindexlayout") {
//     console.log("hit");
//     return res.render(`${layout}`, {
//       image: req.session.image,
//       studentid: req.session.studentid,
//       fullname: req.session.fullname,
//       accesstype: req.session.accesstype,
//       status: req.session.status,
//     });
//   } else {
//     roleacess.forEach((key, item) => {
//       counter += 1;
//       var routes = key.routes;

//       routes.forEach((value, index) => {
//         // console.log(`${key.role} - ${value.layout}`);

//         if (key.role == req.session.accesstype && value.layout == layout) {
//           console.log("Role: ", req.session.accesstype, "Layout: ", layout);
//           ismatch = true;

//           return res.render(`${layout}`, {
//             image: req.session.image,
//             studentid: req.session.studentid,
//             fullname: req.session.fullname,
//             accesstype: req.session.accesstype,
//             status: req.session.status,
//           });
//         }
//       });

//       if (counter == roleacess.length) {
//         if (!ismatch) {
//           res.redirect("/login");
//         }
//       }
//     });
//   }
// };



