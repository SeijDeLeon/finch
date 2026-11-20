import { DeviceControllerBox, TableDeviceController, useSimOphydPVSocket } from '@blueskyproject/finch';
import { CubeTransparent } from '@phosphor-icons/react';
import DemoNotice from '../DemoNotice';

// useSimOphydPVSocket is a drop-in stand-in for useOphydPVSocket: any name other than
// "sineSignal" / "noisySignal" behaves as a simulated motor that moves when set.
const SIM_MOTORS = ['sample_x', 'sample_y', 'detector_z'];

export default function ControlsPage() {
    const { devices, handleSetValueRequest, toggleDeviceLock, toggleExpand } =
        useSimOphydPVSocket(SIM_MOTORS);

    return (
        <div className="ex-page">
            <DemoNotice>
                These controllers drive simulated motors in your browser. In a real app, swap
                <code> useSimOphydPVSocket</code> for <code>useOphydPVSocket</code> to talk to EPICS
                devices.
            </DemoNotice>
            <div className="ex-grid">
                <DeviceControllerBox
                    title="Sample X"
                    device={devices['sample_x']}
                    handleSetValueRequest={handleSetValueRequest}
                    handleLockClick={toggleDeviceLock}
                    svgIcon={<CubeTransparent size={72} />}
                />
                <DeviceControllerBox
                    title="Sample Y"
                    device={devices['sample_y']}
                    handleSetValueRequest={handleSetValueRequest}
                    handleLockClick={toggleDeviceLock}
                    svgIcon={<CubeTransparent size={72} />}
                />
            </div>
            <TableDeviceController
                devices={devices}
                handleSetValueRequest={handleSetValueRequest}
                toggleDeviceLock={toggleDeviceLock}
                toggleExpand={toggleExpand}
            />
        </div>
    );
}
