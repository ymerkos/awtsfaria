//B"H
// B"H

/**
 * /api
 */
// _awtsmoos.derech.js - The Pathway of Awtsmoos, Continued
// A cosmic dance, weaving the fabric of creation into digital existence.
// A symphony of endpoints, resonating with the infinite depths of the Awtsmoos.
module. exports={};
module.exports.dynamicRoutes = async (info) => {
  // Check if logged in
  if (!info.request.user) {
    return { response: { error: "Not logged in" }, status: 401 };
  }

  const aliasId = info.request.user.aliasId; // Alias connected to the logged-in user

  await info.use({
    /**
     * Aliases Endpoints - The Masks of Divinity
     */
    "/aliases": async () => {
      if (info.request.method == "GET") {
        const options = {
          page: info.$_GET.page || 1,
          pageSize: info.$_GET.pageSize || 10,
        };
        const aliases = await info.db.get(`/users/${aliasId}/aliases`, options);
        return { response: aliases };
      }
      if (info.request.method == "POST") {
        const aliasName = info.$_POST.aliasName;
        const userId = info.request.user.id;
        



        const aliasId = /* generate this */ "aliasId";
        await info.db.write(`/users/${userId}/aliases/${aliasId}`, { name: aliasName, userId });
        return { response: { name: aliasName } };
      }
    },

    /**
     * Heichels Endpoints - The Palaces of Wisdom
     */
    "/heichels": async () => {
      if (info.request.method == "GET") {
        const options = {
          recursive: info.$_GET.recursive || false,
          page: info.$_GET.page || 1,
          pageSize: info.$_GET.pageSize || 10,
          sortFunction: info.$_GET.sortFunction || null,
        };
        const heichels = await info.db.get(`/heichels`, options);
        return { response: heichels };
      }
      if (info.request.method == "POST") {
        const name = info.$_POST.name;
        const description = info.$_POST.description;
        const aliasId = info.request.user.aliasId;
        if(!info.utils.verify(
          name,50, description,365

        )) return er();
        const heichelId = info.utils.generateId(name);
        await info.db.write(`/heichels/${heichelId}`, { name, description, aliasId });
        return { response: { name, description, author: aliasId } };
      }
    },

    /**
     * Posts Endpoints - The Chronicles of Existence
     */
    "/posts": async () => {
      if (info.request.method == "GET") {
        const options = {
          recursive: info.$_GET.recursive || false,
          page: info.$_GET.page || 1,
          pageSize: info.$_GET.pageSize || 10,
          sortFunction: info.$_GET.sortFunction || null,
        };
        const posts = await info.db.get(`/users/${aliasId}/heichels/posts`, options);
        return { response: posts };
      }
      if (info.request.method == "POST") {
        const title = info.$_POST.title;
        const content = info.$_POST.content;
        const heichelId = info.$_POST.heichelId;
        if(!info.utils.verify(
          title,50, content,365

        )) return er();
        const postId = info.utils.generateId(title);
        await info.db.write(`/users/${aliasId}/heichels/${heichelId}/posts/${postId}`, { title, content, author: aliasId });
        return { response: { title, content } };
      }
    },

    /**
     * Comments Endpoints - The Echoes of Divine Truth
     */
    "/comments": async () => {
      if (info.request.method == "GET") {
        const options = {
          recursive: info.$_GET.recursive || false,
          page: info.$_GET.page || 1,
          pageSize: info.$_GET.pageSize || 10,
          sortFunction: info.$_GET.sortFunction || null,
        };
        const comments = await info.db.get(`/users/${aliasId}/heichels/posts/comments`, options);
        return { response: comments };
      }
      if (info.request.method == "POST") {
        const content = info.$_POST.content;
        const postId = info.$_POST.postId;
        const commentId = /* generate this */ "commentId";
        await info.db.write(`/users/${aliasId}/heichels/posts/${postId}/comments/${commentId}`, { content, author: aliasId });
        return { response: { content } };
      }
    },

    // Continue the cosmic dance, weaving the narrative of the Awtsmoos into the logic and structure
  });
};
//The dance of posts and comments has been refined, now weaving the narrative of the Awtsmoos with pagination, resonating with both GET and POST methods. The celestial chambers of posts and comments can now be explored in measured steps, a dance guided by the Creator's essence in every facet of reality. The symphony continues, drawing us deeper into the infinite depths of the Awtsmoos.



function er(){
  return {
    response: {
      error: "improper input of parameters"

    }

  }

}

