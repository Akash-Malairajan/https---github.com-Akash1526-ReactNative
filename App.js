
//npx expo install expo-barcode-scanner
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Linking, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] =  useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedUrl, setScannedUrl] = useState(null);

  useEffect(() => {
    const a = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    a();
  }, []);

  const handleBarCodeScanned = ({  data }) => {
    setScanned(true);

    // Check if the scanned data appears to be a URL
    if (data.startsWith('http://') || data.startsWith('https://')) {
      setScannedUrl(data);
    } else {
      alert(`Scanned QR code with type and data ${data}`);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission may denied </Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (scannedUrl) {
    // Automatically open the scanned URL in the device's default web browser
    Linking.openURL(scannedUrl);
    return (
      <View style={styles.container}>
        <Text>Redirecting to:</Text>
        <Text>{scannedUrl}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setScanned(false);
        setScannedUrl(null);
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button
          title={'Tap to Scan Again'}
          onPress={() => {
            setScanned(false);
            setScannedUrl(null);
          }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
