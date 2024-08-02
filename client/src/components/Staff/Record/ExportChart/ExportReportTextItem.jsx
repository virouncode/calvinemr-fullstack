

const ExportReportTextItem = ({ item }) => {
  return (
    <div style={{ padding: "30px" }}>
      <div style={{ fontWeight: "bold" }}>{item.name}</div>
      <div style={{ marginLeft: "20px", whiteSpace: "pre-wrap" }}>
        {item.Content?.TextContent}
      </div>
    </div>
  );
};

export default ExportReportTextItem;
