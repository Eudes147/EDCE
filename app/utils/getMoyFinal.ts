export const getMoyFinal=(moyEval: number, moyConcours: number)=>{
  return (moyEval*0.4+moyConcours*0.6).toFixed(2)
}