import bcrypt from 'bcrypt'

const HashPassword = async (originalPass: string) => {
    return await bcrypt.hash(originalPass, 15)
}

export { HashPassword }