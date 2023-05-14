import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import UserForm from '../components/userform/UserForm';
import RepositoryList from '../components/repositorylist/RepositoryList';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleFormSubmit = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        setRepositories([]); // Clear the previous search results
        loadUserRepositories(username);
      } else {
        throw new Error('Failed to fetch user information');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadUserRepositories = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (response.ok) {
        const data = await response.json();
        setRepositories(data);
      } else {
        throw new Error('Failed to fetch user repositories');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToFavorites = (repository: any) => {
    if (!favorites.some((fav) => fav.id === repository.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, repository]);
    }
  };

  const handleRemoveFromFavorites = (repository: any) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== repository.id));
  };

  return (
    <Container className="home-page">
      <h1>GitHub Repository Explorer</h1>
      <UserForm onSubmit={handleFormSubmit} />
      <hr />
      {userInfo && (
        <div className="user-info">
          <h3>Username: {userInfo.login}</h3>
          <p>Name: {userInfo.name}</p>
    <p>Bio: {userInfo.bio}</p>
    <p>Location: {userInfo.location}</p>
    <p>Public Repositories: {userInfo.public_repos}</p>
        </div>
      )}
      <div className="home-page-content">
        <div className="repository-list">
          <h2>Search Results</h2>
          <RepositoryList
            repositories={repositories}
            favorites={favorites}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        </div>
        <div className="favorites">
          <h2>Favorite Repositories</h2>
          <RepositoryList
            repositories={favorites}
            favorites={favorites}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
