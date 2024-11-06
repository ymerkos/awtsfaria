//B"H

      var controls =
        document
        .createElement(
          "div"
        );
      cmCont
        .appendChild(
          controls
        );
      controls
        .className =
        "comment-controls"
      
      if (!
        doesOwn
      )
        continue;
      var ed =
        document
        .createElement(
          "a"
        );
      controls
        .appendChild(
          ed
        );
      ed.className =
        "edit btn"
      ed.textContent =
        "Edit comment";
      ed.href = `/heichelos/${
                                    post.heichel.id
                                }/edit?${
                                    commentParams +

                                    getLinkHrefOfEditing()+
                                    "&id="+c
                                }`;
      
      
      var del =
        document
        .createElement(
          "button"
        );
      controls
        .appendChild(
          del
        )
      del.className =
        "delete btn"
      del.textContent =
        "Delete comment";
      del.onclick =
        async () => {
          var does =
            confirm(
              "Delete this comment?"
            );
          if (!
            does
          )
            return;
          var a = null;
            /*await getAPI(
              `/api/social/heichelos/${
                                        post.heichel.id
                                    }/comment/${
                                        c
                                    }`, {
                method: "DELETE",
                body: new URLSearchParams({
                  aliasId: post
                    .author
                })
                
                
              }
            );*/
          if (!
            a
          )
            return;
          if (a
            .success
          ) {
            cmCont
              .parentNode
              .removeChild(
                cmCont
              )
          }
        };
