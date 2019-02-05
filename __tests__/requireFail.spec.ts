import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main';
import sleep from './utils/sleep';
const el = document.createElement('div');

test('tap与doubletap间隔过长的时候, doubletap是否不会触发?', async (done) => {
    const mockTapCallback = jest.fn();
    const mockDoubletapCallback = jest.fn();

    const tap2 = new AnyTouch.TapRecognizer({ name: 'doubletap', pointer: 1, taps: 2 })
    const at = new AnyTouch(el);
    at.add(tap2);
    const tap1 = at.get('tap');
    tap1.requireFailure(tap2);

    at.on('tap', (e) => {
        mockTapCallback();
    });
    
    at.on('doubletap', (e) => {
        mockDoubletapCallback();
    });
    
    const ts = new TouchSimulator(el);
    // 模拟touch触碰
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    ts.dispatchTouchEnd();

    await sleep(500);
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    ts.dispatchTouchEnd();
    await sleep(500);
    expect(mockDoubletapCallback.mock.calls.length).toBe(0);
    expect(mockTapCallback.mock.calls.length).toBe(2);
    done();
});