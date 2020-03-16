import {BuildFoundMessage, endMessage, startSearch} from "./index"
import {reduce} from "rxjs/operators"
import {Build} from "./data"

describe("startSearch", () => {
  const worker = {
    postMessage: jest.fn(),
    onmessage: jest.fn(),
    // as Mock<
    //     { data: { type: "end", data: undefined } | { type: "build-found", data: Build } }, void>
    terminate: jest.fn(),
  }

  let origWorker: any
  beforeAll(() => {
    origWorker = window.Worker
    //@ts-ignore
    window.Worker = () => worker
  })

  afterAll(() => {
    //@ts-ignore
    window.worker = origWorker
  })

  test("without found builds", () => testSimulatingWorker())

  test("with 5 found builds", () => testSimulatingWorker({build: 1}, {build: 2}, {build: 3}, {build: 4}, {build: 5}))

  function testSimulatingWorker(...builds: any[]) {
    simulateCalc(...builds)
    return startSearch({leveledSkills: []}, {decorations: [], availableParts: []})
      .pipe(reduce((acc, build) => [...acc, build], [] as Build[]))
      .toPromise()
      .then(receivedBuilds => expect(builds).toEqual(receivedBuilds))
  }

  function simulateCalc(...builds: Build[]) {
    worker.postMessage.mockImplementation(() => {
      builds.forEach(build => worker.onmessage({data: new BuildFoundMessage(build)}))
      worker.onmessage({data: endMessage})
    })
  }
})
