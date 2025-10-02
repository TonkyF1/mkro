export interface MKROOutput {
  type: 'PLAN_PROPOSAL' | 'SAVE_DIRECTIVES' | 'PROFILE_UPDATE' | 'STATUS_SUMMARY';
  data: any;
}

export function parseCoachOutput(response: string): {
  humanText: string;
  machineOutput: MKROOutput | null;
} {
  // Extract machine-readable block
  const startMarker = '<!--MKRO_OUTPUT-->';
  const endMarker = '<!--/MKRO_OUTPUT-->';
  
  const startIdx = response.indexOf(startMarker);
  const endIdx = response.indexOf(endMarker);
  
  let humanText = response;
  let machineOutput: MKROOutput | null = null;
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    // Extract human text (everything before machine block)
    humanText = response.substring(0, startIdx).trim();
    
    // Extract and parse machine block
    const machineBlock = response.substring(
      startIdx + startMarker.length,
      endIdx
    ).trim();
    
    try {
      const parsed = JSON.parse(machineBlock);
      machineOutput = {
        type: parsed.type,
        data: parsed
      };
    } catch (error) {
      console.error('Failed to parse machine output:', error);
    }
  }
  
  return { humanText, machineOutput };
}