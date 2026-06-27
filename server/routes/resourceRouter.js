const express = require('express');
const upload = require('../middleware/uploadMiddleware');

const createResourceRouter = (controller) => {
    const router = express.Router();

    router.get('/', controller.getAll);
    router.post('/', upload.single('photo'), controller.create);
    router.put('/:id', upload.single('photo'), controller.update);
    router.patch('/:id/delete', controller.remove);
    router.patch('/:id/undelete', controller.undelete);
    router.patch('/:id/archive', controller.archive);
    router.patch('/:id/unarchive', controller.unarchive);

    return router;
};

module.exports = createResourceRouter;