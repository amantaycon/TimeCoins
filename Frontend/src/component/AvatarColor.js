const AvatarColor = (id) => {
    const colors = ["#f48fb1", "#ce93d8", "#81d4fa", "#a5d6a7", "#ffcc80"];
    const index = id % colors.length;
    return colors[index];
  };
export default AvatarColor;