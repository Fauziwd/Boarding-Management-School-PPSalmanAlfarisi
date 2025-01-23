export default function Selectbox({
    className = "",
    options = [],
    currentValue = "",
    ...props
}) {
    return (
        <select
            {...props}
            defaultValue={currentValue}
            className={
                "rounded dark:bg-gray-800 focus:outline-none py-2 px-4 block w-full appearance-none leading-normal " +
                className
            }
        >
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
