class GenerateOtp {
  createOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

export default GenerateOtp;
