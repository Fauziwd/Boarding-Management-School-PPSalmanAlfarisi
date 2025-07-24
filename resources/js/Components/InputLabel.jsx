// PERBAIKAN: isRequired dipisahkan dari ...props untuk mencegahnya diteruskan ke DOM.
// Ini juga secara otomatis menambahkan tanda bintang merah jika isRequired bernilai true.
export default function InputLabel({ value, className = '', children, isRequired = false, ...props }) {
    return (
        <label {...props} className={`block font-medium text-sm text-gray-700 dark:text-gray-300 ` + className}>
            {value ? value : children}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}
