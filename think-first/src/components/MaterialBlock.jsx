function getSafeUrl(value) {
  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function MaterialBlock({ material, sourceUrl }) {
  const safeUrl = getSafeUrl(sourceUrl);

  return (
    <section className="material-content" aria-label="Учебный материал">
      <h3>Материал для изучения</h3>
      <p className="material-text">{material}</p>

      {safeUrl && (
        <a
          className="material-source"
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть источник в новой вкладке
        </a>
      )}
    </section>
  );
}

export default MaterialBlock;