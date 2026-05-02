const tf = require('@tensorflow/tfjs-node');

const loadModel = async () => {
    try {
        const model = await tf.loadLayersModel('file://path-to-your-model/model.json');
        console.log('Model loaded successfully.');
        return model;
    } catch (error) {
        console.error('Error loading model:', error.message);
        throw error;
    }
};

const predict = async (imageBuffer) => {
    try {
        const model = await loadModel();
        const tensor = tf.node.decodeImage(imageBuffer, 3)
            .resizeNearestNeighbor([224, 224]) // Adjust size as per model requirements
            .toFloat()
            .expandDims();

        const prediction = model.predict(tensor);
        return prediction.dataSync(); // Extract prediction results
    } catch (error) {
        console.error('Error making prediction:', error.message);
        throw error;
    }
};

module.exports = { predict };
