// Defined at module level (NOT inside another component) so inputs keep focus while typing.
export default function FormField({ id, label, error, as: Tag = 'input', className = '', children, ...rest }) {
  return (
    <div className={`field ${error ? 'fielderr' : ''} ${className}`}>
      <label htmlFor={id}>{label}</label>
      {children ?? <Tag id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...rest} />}
      {error && <div className="field__error" id={`${id}-error`} role="alert">{error}</div>}
    </div>
  );
}
