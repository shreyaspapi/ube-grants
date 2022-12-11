import { WaitForTransaction } from "../utils/utils"

const ModalForm = ({onMilestoneDescriptionChange, currentTxHash, onSubmitDescription}) => {
    return (
        <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white ">
                <div className="px-6 py-6 lg:px-8">
                    <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Apply for milestone</h3>
                    <form className="space-y-6" onSubmit={onSubmitDescription}>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea onChange={e => onMilestoneDescriptionChange(e.target.value)} id="description" name="description" rows="3" className="block w-full px-4 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50" placeholder="Enter your description"></textarea>
                        </div>    
                        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
                    {currentTxHash && <WaitForTransaction txHash={currentTxHash} />}
                </div>
            </div>
        </div>
    )

}

export default ModalForm