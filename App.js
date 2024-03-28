import React from 'react';
import { ScrollView } from 'react-native';
import Header from './components/Header';
import AnimeSelector from './components/AnimeSelector';

export default function App() {
  return (
    <ScrollView>
      <Header />
      <AnimeSelector />
    </ScrollView>
  );
}