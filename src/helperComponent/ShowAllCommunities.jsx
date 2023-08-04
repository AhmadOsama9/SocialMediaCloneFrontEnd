import {useEffect } from 'react';
import { useShowCommunities } from '../hooks/useShowCommunities';

const ShowAllCommunities = () => {
  const { isLoading, error, communities, showCommunities } = useShowCommunities(); 

  useEffect(() => {
    showCommunities();
  }, []);

  if ( isLoading ) {
    return (<h3>Loading</h3>);
  }
  if (error) {
    return (<h3>Error: {error}</h3>);
  }

  if (communities.length === 0) {
    return <h3>Currently no communities was created</h3>
  }

  return (
    <div className="friends">
      <h2>Communities</h2>
      {communities.map((community) => (
        <div key={community.name}>
            <span>Name: {community.name}</span>
            <span>Desciption: {community.description}</span>
            <button>Show Communitiy</button>
        </div>
      ))}
    </div>
  )
}

export default ShowAllCommunities;