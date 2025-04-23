export const getReactionIcon = (type) => {
    switch(type) {
      case "like": return <ThumbsUp size={16} />;
      case "love": return <Heart size={16} />;
      case "angry": return <Frown size={16} />;
      case "care": 
      case "sad": return <Smile size={16} />;
      default: return <ThumbsUp size={16} />;
    }
  };

export const getReactionEmoji = (type) => {
    switch(type) {
      case "like": return "👍";
      case "love": return "❤️";
      case "angry": return "😡";
      case "sad": return "😢";
      case "care": return "🤗";
      default: return "👍";
    }
  };
