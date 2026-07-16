type ResponsiveImageProps = {
  avif?: string;
  fallback: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
};

export function ResponsiveImage({
  avif,
  fallback,
  alt,
  width,
  height,
  className = "",
  eager = false,
}: ResponsiveImageProps) {
  return (
    <picture className={`media-picture${className ? ` ${className}` : ""}`}>
      {avif ? <source srcSet={avif} type="image/avif" /> : null}
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
