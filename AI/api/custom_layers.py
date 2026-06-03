import tensorflow as tf

@tf.keras.utils.register_keras_serializable()
class FeatureNoiseLayer(tf.keras.layers.Layer):

    def __init__(
        self,
        noise_factor=0.01,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.noise_factor = noise_factor

    def call(
        self,
        inputs,
        training=False
    ):
        if training:
            noise = tf.random.normal(
                shape=tf.shape(inputs),
                mean=0.0,
                stddev=self.noise_factor
            )
            return inputs + noise
        return inputs

    def get_config(self):
        config = super().get_config()
        config.update({
            "noise_factor": self.noise_factor
        })
        return config


@tf.keras.utils.register_keras_serializable()
class DenseWithQuantization(tf.keras.layers.Dense):

    def __init__(
        self,
        *args,
        quantization_config=None,
        **kwargs
    ):
        self.quantization_config = quantization_config
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)

    @classmethod
    def from_config(cls, config):
        config = dict(config)
        config.pop("quantization_config", None)
        return super().from_config(config)


# Patch Keras Dense globally for older/newer serialization compatibility.
_original_dense_from_config = tf.keras.layers.Dense.from_config
_original_dense_init = tf.keras.layers.Dense.__init__

@classmethod
def _patched_dense_from_config(cls, config):
    config = dict(config)
    config.pop("quantization_config", None)
    return _original_dense_from_config(config)


def _patched_dense_init(self, *args, quantization_config=None, **kwargs):
    kwargs.pop("quantization_config", None)
    return _original_dense_init(self, *args, **kwargs)


tf.keras.layers.Dense.from_config = classmethod(_patched_dense_from_config)
tf.keras.layers.Dense.__init__ = _patched_dense_init
