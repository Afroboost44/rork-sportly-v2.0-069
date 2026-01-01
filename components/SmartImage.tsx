import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface SmartImageProps extends Omit<ImageProps, 'source'> {
  source: string | { uri: string };
  fallbackGradient?: [string, string, ...string[]];
}

export default function SmartImage({ source, style, fallbackGradient, ...props }: SmartImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const uri = typeof source === 'string' ? source : source.uri;

  const defaultGradient: [string, string, ...string[]] = fallbackGradient || [Colors.dark.primary, Colors.dark.purple];

  if (error || !uri) {
    return (
      <View style={[styles.fallback, style]}>
        <LinearGradient
          colors={defaultGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  return (
    <>
      {loading && (
        <View style={[styles.fallback, style]}>
          <LinearGradient
            colors={[Colors.dark.cardBg, Colors.dark.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
      <Image
        {...props}
        source={{ uri }}
        style={[style, loading && styles.hidden]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: Colors.dark.cardBg,
    overflow: 'hidden',
  },
  hidden: {
    opacity: 0,
  },
});
