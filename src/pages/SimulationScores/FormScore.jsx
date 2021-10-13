import { Descriptions } from "antd"
import useErrorCatcher from "hooks/useErrorCatcher";
import useModels from "hooks/useModels";
import { parse } from "query-string";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router"

const FormScore = () => {
  const { search } = useLocation();
  const { form } = useMemo(() => parse(search), [search]);
  const [scores, setScores] = useState([]);
  const { models: { StudyProgramScore } } = useModels();
  const { errorCatch } = useErrorCatcher();

  const getScores = useCallback(() => {
    StudyProgramScore.collection({
      attributes: ['score_type', 'magister', 'doctor', 'profession'],
      where: {
        score_type: form === '2.a' ? '3.a.1' : form
      },
      include: [{
        model: 'StudyProgram',
        attributes: ['name', 'id'],
        include: [{
          model: 'Department',
          attributes: ['id', 'name']
        }]
      }]
    }).then(resp => {
      setScores(resp.rows);
    }).catch(errorCatch);
  }, [StudyProgramScore, errorCatch, form]);

  useEffect(() => {
    getScores();    
  }, [getScores]);

  const sumScore = useMemo(() => (
    scores.length > 1 ?
      scores.map(score => score.magister + score.doctor + score.profession).reduce((a, b) => (a + b))
      :
      scores.length > 0 ?
        scores.map(score => score.magister + score.doctor + score.profession)[0]
        :
        0
  ), [scores]);

  const doctorScore = useMemo(() => (
    scores.length > 1 ?
      scores.map(score => score.doctor).reduce((a, b) => (a + b))
      :
      scores.length > 0 ?
        scores.map(score => score.doctor)[0]
        :
        0
  ), [scores]);

  const pds3Score = useMemo(() => (
    ((doctorScore / sumScore) * 100).toFixed(3)
  ), [doctorScore, sumScore]);

  return (
    <div>
      {form === '3.a.1' &&
        <Descriptions column={5} style={{ marginTop: 12 }} layout="vertical" bordered>
          <Descriptions.Item label="NDTPS" span={3}>
            {
              sumScore
            }
          </Descriptions.Item>
          <Descriptions.Item label="Skor" span={2}>
            {
              sumScore >= 12 ?
                4
                :
                3
            }
          </Descriptions.Item>
          <Descriptions.Item label="4">
            Jika NDTPS &gt;= 12 maka skor = 4
          </Descriptions.Item>
          <Descriptions.Item label="3">
          </Descriptions.Item>
          <Descriptions.Item label="2">
            Jika 3 &lt;= NDTPS = 12 maka Skor = 2 ((2 x NDTPS) + 12) / 9
          </Descriptions.Item>
          <Descriptions.Item label="1">Tidak ada skor diantara 0 dan 2</Descriptions.Item>
          <Descriptions.Item label="0">Jika NDTPS &lt; 3 maka skor = 0</Descriptions.Item>
        </Descriptions>}
      {form === '3.a.1.1' &&
        <Descriptions style={{ marginTop: 12 }} column={5} layout="vertical" bordered>
          <Descriptions.Item span={2} label="Hasil NDTPS">
            {
              sumScore
            }
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Skor PDS3">
            {
              pds3Score
            } %
          </Descriptions.Item>
          <Descriptions.Item span={1} label="Skor PDS3">
            {
              pds3Score > 30 ?
                4
                :
                pds3Score < 30 ?
                  Math.floor(2 + ((20 * pds3Score) / 3))
                  :
                  1
            }
          </Descriptions.Item>
          <Descriptions.Item label="4">
            Jika PDS3 ≥ 30% , maka Skor = 4
          </Descriptions.Item>
          <Descriptions.Item label="3">
          </Descriptions.Item>
          <Descriptions.Item label="2">
            Jika PDS3 &lt; 30% maka Skor = 2 + ((20 x PDS3)/3)
          </Descriptions.Item>
          <Descriptions.Item label="1"></Descriptions.Item>
          <Descriptions.Item label="0">Tidak ada skor diantara 0 dan 2</Descriptions.Item>
          <Descriptions.Item label="Keterangan" span={5}>
            <div>NDTPS = Jumlah dosen tetap yang ditugaskan sebagai pengampu mata kuliah dengan bidang keahlian yang sesuai dengan kompetensi inti Program Studi yang diakreditasi</div>
            <div>NDS3 = Jumlah DTPS yang berpendidikan tertinggi Doktor/Doktor Terapan/Subspesialis.</div>
            <div>PDS3 = (NDS3 / NDTPS) x 100%</div>
          </Descriptions.Item>
        </Descriptions>
      }
      {form === '3.a.1.2' && <Descriptions style={{ marginTop: 12 }} column={5} layout="vertical" bordered>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1"></Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text1" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text2" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text3" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text4" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="text5" span={5}>
        </Descriptions.Item>
      </Descriptions>}
      {form === '.' && <Descriptions style={{ marginTop: 12 }} column={5} layout="vertical" bordered>
        <Descriptions.Item label="Kelompok sains teknologi" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1"></Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="Kelompok sosial humanioral" span={5}>
        </Descriptions.Item>
        <Descriptions.Item label="4">
          text
        </Descriptions.Item>
        <Descriptions.Item label="3">
        </Descriptions.Item>
        <Descriptions.Item label="2">
          text
        </Descriptions.Item>
        <Descriptions.Item label="1"></Descriptions.Item>
        <Descriptions.Item label="0">text</Descriptions.Item>
        <Descriptions.Item label="text" span={5}>
        </Descriptions.Item>
      </Descriptions>}
    </div>

  )
}

export default FormScore
