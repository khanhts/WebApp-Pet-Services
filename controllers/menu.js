let menuModel = require("../schemas/menu");
module.exports = {
  GetAllMenus: async function () {
    return await menuModel.find();
  },
  GetMenuById: async function (id) {
    return await menuModel.findOne({ _id: id });
  },
  GetMenuByText: async function (text) {
    return await menuModel.findOne({ text: text });
  },
  GetMenuHierarchy: async function (parentId = null) {
    let menus = await menuModel.find({ parent: parentId });

    for (let i = 0; i < menus.length; i++) {
      let menu = menus[i];
      let children = await this.GetMenuHierarchy(menu._id);
      if (children.length > 0) {
        menus[i] = { ...menu.toObject(), children };
      }
    }

    console.log(`Final menu structure: `, menus);
    return menus;
  },
  CreateAMenu: async function (text, url = null, parent) {
    try {
      let existingMenu = await menuModel.findOne({ text: text });
      if (existingMenu) {
        throw new Error("Menu already exists");
      }
      if (!url) {
        url =
          "/" +
          text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-");
      }
      let newMenu = new menuModel({
        text: text,
        url: url,
      });
      if (parent) {
        let parentMenu = await this.GetMenuByText(parent);
        if (!parentMenu) {
          throw new Error("Parent menu not found");
        }
        newMenu.parent = parentMenu._id;
      } else {
        newMenu.parent = null;
      }

      return await newMenu.save();
    } catch (error) {
      throw new Error("Error creating menu: " + error.message);
    }
  },
};
