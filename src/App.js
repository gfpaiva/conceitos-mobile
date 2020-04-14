import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

const Repository = function({ repository, handleLikeRepository }) {
  const { id, title, techs, likes } = repository;

  return (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{title}</Text>

      <View style={styles.techsContainer}>
        {techs.map(tech => (
          <Text key={tech} style={styles.tech}>
            {tech}
          </Text>
        ))}
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          testID={`repository-likes-${id}`}
        >
          {likes} curtidas
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLikeRepository(id)}
        testID={`like-button-${id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [repositories, setRepositories] = useState([]);
  useEffect(() => {
    api.get('/repositories')
      .then(({ data }) => setRepositories(data));
  }, [])

  async function handleLikeRepository(id) {
    try {
      const { data } = await api.post(`/repositories/${id}/like`);

      const repositoryIdx = repositories.findIndex(repository => repository.id === id);
      const newRepositories = new Array(...repositories);
      newRepositories[repositoryIdx].likes = data.likes;
      
      setRepositories(newRepositories);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <Repository
              repository={repository}
              handleLikeRepository={handleLikeRepository}
            />
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
