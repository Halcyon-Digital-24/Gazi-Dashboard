import { useState } from "react";
import CardBody from "../../components/card-body";
import DescriptionInput from "../../components/description";
import Display from "../../components/display";
import { Button } from "../../components/button";
import './index.scss'


const HtmlGenerator = () => {

    const [data, setData] = useState<any>('')
    const [isShow, setIsShow] = useState<boolean>(false)

    const handleChange = (editedData: any) => {
        setData(editedData)
        const view: any = document.getElementById('view-html')
        if (view && isShow) view.innerHTML = data
    }

    const previewData = () => {
        setIsShow(!isShow)
        const view: any = document.getElementById('view-html')
        if (view && isShow) view.innerHTML = data
    }

    return (
        <section>
            <CardBody header="HTML-Generator" to="/" text="back" />
            <Display>
                <div className=" p-3">
                    <DescriptionInput value={data} setValue={handleChange} />
                </div>

            </Display>
            <Display>
                <div className="row btn-group ">
                    <Button onClick={previewData}>Preview</Button>
                    <Button onClick={() => navigator.clipboard.writeText(data || '')}>Copy</Button>
                </div>
                {
                    isShow&&data ?
                        <div
                            dangerouslySetInnerHTML={{ __html: data }}
                        /> : ''
                }

            </Display>

        </section>
    )
}

export default HtmlGenerator;
