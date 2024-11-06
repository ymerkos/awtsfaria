//B"H
import {

	getCommentsByAlias,
	getCommentsOfAlias,
	getComment
	
} from "/scripts/awtsmoos/api/utils.js";

import {
	addTab,
	getLinkHrefOfEditing
	
} from "/heichelos/post/postFunctions.js"
async function openCommentsOfAlias({alias, tab, post}) {
  tab
      .innerHTML =
      "Loading comments...";
    var coms =
      await getCommentsOfAlias({
        postId: post
          .id,
        heichelId: post
          .heichel
          .id,
        aliasId: alias
      });
  
    if (Array
      .isArray(
        coms
      )
    ) {
      //    coms = coms.reverse();
    } else {
      return console
        .log(
          "No comments"
        )
    }
    if (coms
      .length ==
      0
    ) {
      tab
        .innerHTML =
        "No comments yet from this user";
      return
      
    }
    tab
      .innerHTML =
      "";
    
    //(coms,"Comments")
    for (
      var i =
        0; i <
      coms
      .length; i++
    ) {
      var c =
        coms[
          i
        ] //the id;
      /**
       * we have the IDS now.
       * need comment content of each
       */
      var comment =
        await getComment({
          heichelId: post
            .heichel
            .id,
          commentId: c
        });
      //  console.log("Comment",comment)
      
      
      var cmCont =
        document
        .createElement(
          "div"
        );
      cmCont
        .className =
        "comment-content";
      tab
        .appendChild(
          cmCont
        );
      cmCont
        .innerHTML =
        comment
        .content;
      var d =
        comment
        .dayuh;
      
      var sc =
        d ?
        d
        .sections :
        null;
      
      if (
        sc
      )
        sc
        .forEach(
          q => {
            var cs =
              document
              .createElement(
                "div"
              );
            cs.className =
              "comment-section"
            cmCont
              .appendChild(
                cs
              );
            cs.innerHTML =
              q;
            
            
          }
        );
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
    }
  }
}
async function loadRootComments(post) {
	var cm = window.comments;
	if (!cm) {
		// console.log("LOL")
	}
	cm.innerHTML =
		"Contining to load..."
	var aliases =
		await getCommentsByAlias({
			postId: post.id,
			heichelId: post
				.heichel.id
		});
	cm.innerHTML = ""
	window.aliasesOfComments =
		aliases;
	
	if (!Array.isArray(aliases) || !
		aliases.length) {
		cm.innerHTML =
			"No comments yet!"
		return;
	}
	aliases.forEach(w => {
		var com = document
			.createElement(
				"div")
		com.className =
			"comment"
		
		/*var hd = document.createElement("div")
		hd.className = "alias-name";
		com.appendChild(hd);
		hd.innerHTML = `
		    <a href="/@${
		        w
		    }">@${
		        w
		    }</a>
		`;*/
		var alias = w;
		addTab({
			header: "@" +
				alias,
			btnParent: cm,
			addClasses: true,
			tabParent: commentTab,
			content: "Hi",
			async onopen({
				actualTab
			}) {
				openCommentsOfAlias({
          alias,
          tab: actualTab,
          post
        })
		})
		//  cm.appendChild(com);
		/*
                        var cnt = document.createElement("div");
                        cnt.className = "comment-content";
                        cnt.textContent = w;*/
	})
}

export {
  loadRootComments
}
