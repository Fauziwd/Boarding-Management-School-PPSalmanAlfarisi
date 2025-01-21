function CapHafalan({ achievements }) {
    return (
        <div>
            {achievements.length > 0 ? (
                achievements.map((achievement) => (
                    <div key={achievement.id}>
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                        <small>{achievement.date}</small>
                    </div>
                ))
            ) : (
                <p>Belum ada capaian hafalan.</p>
            )}
        </div>
    );
}
export default CapHafalan; 