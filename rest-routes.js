/*
 * Given an express router and a mongoose model
 * Returns the router with GET, PUT, POST and DELETE
 * endpoints setup 
 */
function rest(router, Model, options) {

  function createFindQuery(obj) {
    if (options && options.idConverter) {
      var findQuery = Object.assign({}, obj);
      var keys = Object.keys(findQuery);

      // TODO: make finding idKeys configurable
      var idKeys = keys.filter(k => k.endsWith('Id'));

      for(var i = 0; i < idKeys.length; i++) {
        var currentValue = findQuery[idKeys[i]];
        try {
          findQuery[idKeys[i]] = options.idConverter(currentValue);
        } catch(err) {
          // ignore conversion failure
          // remove key from query
          delete findQuery[idKeys[i]];
        }
      }

      return findQuery;
    }
  }

  function findQuery(req, res, next) {
    var findQuery = {};
    if (Object.keys(req.query).length) {
      findQuery = createFindQuery(req.query);
      if (!Object.keys(findQuery).length) {
        return res.send([]);
      }
    }
    req.findQuery = findQuery;
    next();
  }

  // GET
  router.get("/", findQuery, function(req, res, next) {
    Model.find(req.findQuery, function(err, modelInstances) {
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
