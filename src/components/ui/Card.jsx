export default function Card({ children }) {
    return (
        <div className="bg-white shadow rounded-2xl p-6">
            {children}
        </div>
    );
}