import { Descriptions } from "antd"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { useMemo, useState, useEffect, useCallback } from "react"

const SimulationScore = ({ studyProgramScore, studentScore, study_program_id }) => {
  const { models: { StudyProgram } } = useModels();
  const [studyProgram, setStudyProgram] = useState(undefined);
  const { errorCatch } = useErrorCatcher();

  const getStudyProgram = useCallback(() => {
    if (study_program_id.length > 1) {
      StudyProgram.single(study_program_id[1]).then(resp => {
        setStudyProgram(resp);
      }).catch(errorCatch);
    }
  }, [errorCatch, StudyProgram, study_program_id]);

  useEffect(() => getStudyProgram(), [getStudyProgram]);

  const rmdScore = useMemo(() => (
    studentScore / studyProgramScore
  ), [studyProgramScore, studentScore]);

  return (
    <Descriptions style={{ marginTop: 12 }} column={5} layout="vertical" bordered>
      <Descriptions.Item span={3} label="RMD" >
        {rmdScore.toFixed(3)}
      </Descriptions.Item>
      <Descriptions.Item span={2} label="Skor" >
        {
          rmdScore >= 10 && rmdScore <= 20 ?
            4
            :
            rmdScore < 10 ?
              ((2 * rmdScore) / 5).toFixed(3)
              :
              rmdScore > 20 && rmdScore <= 30 ?
                ((60 - (2 * rmdScore)) / 5).toFixed(3)
                :
                rmdScore > 30 ?
                  0
                  :
                  0
        }
      </Descriptions.Item>
      {
        study_program_id.length > 1 &&
        <Descriptions.Item label={studyProgram?.type === 'technology' ? 'Kelompok Sains Teknologi' : 'Kelompok Sosial Humaniora'} span={5}>
          {studyProgram?.name} (Program Diploma {studyProgram?.diploma === '3' ? 'Tiga' : 'Empat'})
        </Descriptions.Item>}
      <Descriptions.Item label="4">
        Jika 10 ≤ RMD ≤ 20, maka Skor = 4
      </Descriptions.Item>
      <Descriptions.Item label="3">
      </Descriptions.Item>
      <Descriptions.Item label="2">
        Jika RMD &lt; 10 , maka Skor = (2 x RMD) / 5. Jika 20 &lt; RMD ≤ 30 , maka Skor = (60 - (2 x RMD)) / 5
      </Descriptions.Item>
      <Descriptions.Item label="1"></Descriptions.Item>
      <Descriptions.Item label="0">Jika RMD &gt; 30 , maka Skor = 0</Descriptions.Item>
      <Descriptions.Item label="text" span={5}>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default SimulationScore
