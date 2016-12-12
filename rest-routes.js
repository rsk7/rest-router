/*
 * Given an express router and a mongoose model
 * Returns the router with GET, PUT, POST and DELETE
 * endpoints setup 
 */
function rest(router, Model) {
  // GET
  router.get("/", function(req, res, next) {
    Model.find({}, function(err, modelInstances) {
      if (err) next(err);
      else res.send(modelInstances);
    });
  });

  // GET :id
  router.get("/:id", function(req, res, next) {
    var id = req.params.id;
    Model.findById(id, function(err, modelInstance) {
      if (err) next(err);
      else if (!modelInstance) next();
      else res.send(modelInstance);
    });
  });

  // PUT
  router.put("/:id", function(req, res, next) {
    var id = req.params.id;
    var updates = req.body;
    Model.findByIdAndUpdate(id,
      {$set: updates},
      {new: true},
      function(err, modelInstance) {
        if (err) next(err);
        else if (!modelInstance) next();
        else res.send(modelInstance);
      });
  });

  // POST
  router.post("/", function(req, res, next) {
    var modelInstance = new Model(req.body);
    modelInstance.save(function(err) {
      if (err) next(err);
      else res.send(modelInstance);
    });
  });

  // DELETE
  router.delete("/:id", function(req, res, next) {
    var id = req.params.id;
    Model.findByIdAndRemove(id, function(err, modelInstance) {
      if (err) next(err);
      else if (!modelInstance) next();
      else res.send(modelInstance);
    });
  });

  return router;
}

module.exports = rest;
