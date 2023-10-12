const textComponent = {
    marginLeft: '20%',
    marginRight: '20%'
}
 

const Ddi = () => {
    return (
        <div style={textComponent}>
            <h1>Data Deletion Instructions</h1>

            <p>We do not store your personal data; it is only used for authentication purposes. In compliance with data protection rules, we provide instructions on how to delete your activities:</p>

            <h2>Please take following steps</h2>
            <ol style={{marginBottom:'20%'}}>
                <li>Access your account settings.</li>
                <li>Locate the "Apps and Services" section.</li>
                <li>You will find a list of your connected apps and services.</li>
                <li>Find the entry for our platform.</li>
                <li>Click the "Remove" or "Delete" button.</li>
            </ol>
        </div>

    )
}

export default Ddi;