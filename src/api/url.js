let url = ''
if (process.env.NODE_ENV === 'development') {
	url = ''
} else if (process.env.NODE_ENV === 'production') {
	url = ''
}

export default url
