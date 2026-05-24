export default function Input(props) {
    return (
        <input
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...props}
        />
    );
}