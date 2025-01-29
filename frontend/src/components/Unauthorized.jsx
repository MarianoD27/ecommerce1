import GoBackBtn from "./miscelaneous/GoBackBtn"

const Unauthorized = () => {

  return (
    <section className="flex flex-col justify-around items-baseline h-full min-h-[210px]">
      <h1>Unauthorized</h1>
      <p>You do not have access to the requested page.</p>
      <GoBackBtn />
    </section>
  )
}

export default Unauthorized