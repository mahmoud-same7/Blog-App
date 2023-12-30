const {
  CreatePost,
  Get_All_Posts,
  UpdatePost,
  Get_Post_withID,
  Delete_Post_withID,
  Toggle_Like,
} = require("../controller/post");
const { ObjectID } = require("../middlewares/objectID");
const { Upload } = require("../middlewares/uploadImage");
const { verfiyToken } = require("../middlewares/verfiyToken");


const router = require("express").Router();

router.route("/").post(verfiyToken, Upload.single('image'),CreatePost).get(Get_All_Posts);
router
  .route("/:id")
  .put(ObjectID, verfiyToken,Upload.single('image'), UpdatePost)
  .get(ObjectID, Get_Post_withID)
  .delete(ObjectID, verfiyToken, Delete_Post_withID);

  router.route("/like").post(verfiyToken,Toggle_Like);

module.exports = router;
